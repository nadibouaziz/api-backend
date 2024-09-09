import { HttpService } from '@nestjs/axios';
import { All, Controller, Req, Res } from '@nestjs/common';
import { map, catchError, of } from 'rxjs';
import { Response } from 'express';

@Controller('/api')
export class AppController {
  constructor(private httpService: HttpService) {}

  @All('*')
  proxyRequest(@Req() req: Request, @Res() res: Response) {
    const { url, method } = req;
    const serviceUrl = this.getServiceUrl(url);

    return this.httpService
      .request({
        url: serviceUrl,
        method: method,
        data: req.body,
      })
      .pipe(
        map((response) => {
          return res.status(response.status).send(response.data);
        }),
        catchError((error) => {
          const status = error.response?.status || 500;
          const message =
            error.response?.data?.message || 'Internal server error';
          return of(res.status(status).send({ statusCode: status, message }));
        }),
      )
      .subscribe();
  }

  private getServiceUrl(url: string): string {
    const path = url.replace(/^\/api/, '');
    const serviceMapping: Record<string, string> = {
      '/authorization': 'http://authorization-svc:3000',
      '/auth': 'http://authentication-svc:3000',
    };

    const basePath = Object.keys(serviceMapping).find((route) =>
      path.startsWith(route),
    );

    if (basePath) {
      return `${serviceMapping[basePath]}${path.replace(basePath, '')}`;
    }

    throw new Error(`No service found for path: ${path}`);
  }
}
