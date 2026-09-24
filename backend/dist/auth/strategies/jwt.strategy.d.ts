import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TeachersService } from '../../teachers/teachers.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private teachersService;
    constructor(configService: ConfigService, teachersService: TeachersService);
    validate(payload: any): Promise<{
        id: any;
        email: string;
        name: string;
        role: any;
    }>;
}
export {};
