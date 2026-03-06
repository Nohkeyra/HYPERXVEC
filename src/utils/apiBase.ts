import { Capacitor } from "@capacitor/core";

function trimTrailingSlash(v:string){return v.replace(/\/+$/,"");}

export function getApiBaseUrl():string{
 const configured=import.meta.env.VITE_API_URL?.trim();
 if(configured){return trimTrailingSlash(configured);}
 if(Capacitor.isNativePlatform()){return "http://10.0.2.2:3000";}
 return "";
}

export function apiUrl(path:string):string{
 const p=path.startsWith("/")?path:`/${path}`;
 const base=getApiBaseUrl();
 return base?`${base}${p}`:p;
}
