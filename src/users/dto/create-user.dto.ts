export class CreateUserDto {
  // @IsString()
  // @MinLength(4)
  // @MaxLength(20)
  email: string;

  // @IsString()
  // @MinLength(8)
  // @MaxLength(20)
  // @Matches(
  //     /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  //     { message: "password too weak"}
  //     )
  password: string;
}
