

const BASE_URL: string = process.env.BACKEND_BASE_URL as string || "http://localhost:4000";

export function isTokenExpired(token: string): boolean {
  try {
    const payload64 = token.split(".")[1];
    const payload = JSON.parse(atob(payload64));
    const expiry = payload.exp * 1000;
    return Date.now() > expiry;
  } catch (err) {
    return true;
  }
}

export async function refreshAccessToken(): Promise<boolean>{
    try{
        const res = await fetch(`${BASE_URL}/api/auth/refreshToken`,{
            method: 'POST',
            credentials: "include",
        })

        if(!res.ok) return false
         
        const data = await res.json();

        if(data.token.token){
            localStorage.setItem("token", data.token.token);
            return true;
        }
        return false;
    }catch(err){
        console.log("Failed to refresh token", err);
        return false;
    }
}