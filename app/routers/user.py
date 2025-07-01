from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional

from ..database import users_collection, predictions_collection
from .auth import get_current_active_user, UserInDB, UserOut

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

class UserUpdate(BaseModel):
    """Pydantic model for updating user details."""
    username: Optional[str] = None
    email: Optional[EmailStr] = None

@router.put("/me", response_model=UserOut)
async def update_user_me(
    user_update: UserUpdate,
    current_user: UserInDB = Depends(get_current_active_user)
):
    """
    Update the current authenticated user's details.
    """
    update_data = user_update.model_dump(exclude_unset=True)

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No update data provided.",
        )

    # Check for username or email conflicts if they are being updated
    if "username" in update_data and update_data["username"] != current_user.username:
        if users_collection.find_one({"username": update_data["username"]}):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered.",
            )

    if "email" in update_data and update_data["email"] != current_user.email:
        if users_collection.find_one({"email": update_data["email"]}):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered.",
            )

    users_collection.update_one(
        {"username": current_user.username}, {"$set": update_data}
    )

    updated_user_doc = users_collection.find_one({"username": update_data.get("username", current_user.username)})
    if updated_user_doc:
        return UserOut(**updated_user_doc)

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found after update.")

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_me(current_user: UserInDB = Depends(get_current_active_user)):
    """
    Delete the current authenticated user's account and all their data.
    """
    # First, delete all prediction history associated with the user
    predictions_collection.delete_many({"username": current_user.username})

    # Then, delete the user account
    delete_result = users_collection.delete_one({"username": current_user.username})

    if delete_result.deleted_count == 0:
        # This case should be rare if the user is authenticated and exists
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    return