import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
export class UpdateUserDto extends PartialType(
    OmitType(CreateUserDto, ["password", "username", "email", "user_pic"] as const),
) {
}
