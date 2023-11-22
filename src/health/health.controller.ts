import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
    @Get()
    checkHealth(): Record<string, string> {
        return { status: "Healthy" };
    }
}
