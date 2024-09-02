import { HttpService } from '@nestjs/axios';
import { Controller, Get, Req } from '@nestjs/common';
import { map } from 'rxjs';

@Controller('/api')
export class AppController {
  constructor(private httpService: HttpService) {}

  @Get('*')
  proxyRequest(@Req() req: Request) {
    const { url, method } = req;
    const serviceUrl = this.getServiceUrl(url);

    // TODO : improve : just testing kafka ssl connection
    return this.httpService
      .request({
        url: serviceUrl,
        method: method,
        data: req.body,
      })
      .pipe(map((response) => response.data));
  }

  private getServiceUrl(url: string): string {
    const path = url.replace(/^\/api/, '');
    const serviceMapping: Record<string, string> = {
      '/authorization': 'http://authorization-svc:3000',
      '/authentication': 'http://authentication-svc:3000',
    };

    // Find the base path by checking the mapping
    const basePath = Object.keys(serviceMapping).find((route) =>
      path.startsWith(route),
    );

    if (basePath) {
      return `${serviceMapping[basePath]}${path.replace(basePath, '')}`;
    }

    throw new Error(`No service found for path: ${path}`);
  }
}
