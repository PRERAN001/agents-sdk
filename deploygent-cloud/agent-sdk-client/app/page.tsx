"use client";

import { useState } from "react";

export default function DeployPage() {

    const [loading,setLoading]=useState(false);

    async function deploy(){

        setLoading(true);

        const res = await fetch(
            "http://localhost:5000/deploy",
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    project_id:"abc123",

                    repo_url:"https://github.com/PRERAN001/test-sdk-2"

                })

            }
        );

        const data = await res.json();

        console.log(data);

        setLoading(false);

    }

    return(

        <div className="p-10">

            <button
                onClick={deploy}
                className="bg-blue-600 text-white px-6 py-3 rounded"
            >

                {
                    loading
                    ?
                    "Deploying..."
                    :
                    "Deploy"
                }

            </button>

        </div>

    );

}