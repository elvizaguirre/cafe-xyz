import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

export function Auth() {
    return applyDecorators(
        UseGuards(JwtAuthGuard),
        ApiBearerAuth()
    )
}