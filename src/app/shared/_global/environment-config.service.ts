import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { environment as env } from "src/environments/environment";

interface Config {
  apiURL: string;
  IRN_GENERATION_API_ENDPOINT?: string;
}
export interface IAppConfig {
  baseUrl: string;
  baseDMUrl: string;
  baseStandardUrl: string;
  load: () => Promise<void>;
}
@Injectable({
  providedIn: "root",
})
export class AppConfig implements IAppConfig {
  public baseUrl: string;
  public baseDMUrl: string;
  public baseStandardUrl: string;

  constructor(private readonly http: HttpClient) {}

  public load(): Promise<void> {
    return this.http
      .get<Config>("assets/config.json")
      .toPromise()
      .then((config) => {
        // API URL
        this.baseUrl = config.apiURL;
        environment.apiURL = config.apiURL;
        env.apiURL = config.apiURL;

        // Socket URL
        environment.IRN_GENERATION_API_ENDPOINT = config.IRN_GENERATION_API_ENDPOINT;
        env.IRN_GENERATION_API_ENDPOINT = config.IRN_GENERATION_API_ENDPOINT;
      });
  }
}
export function initConfig(config: AppConfig): () => Promise<void> {
  return () => config.load();
}
