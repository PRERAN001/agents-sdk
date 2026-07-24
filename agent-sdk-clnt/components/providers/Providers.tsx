"use client";

import AuthProvider from "./SessionProvider";

export default function Providers({
    children,
}:{
    children:React.ReactNode
}){
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}