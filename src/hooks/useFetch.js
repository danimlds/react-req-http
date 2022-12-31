import { useState, useEffect } from "react";

// custom hook
export const useFetch = (url) => {
    const[data, setData] = useState(null)


// refatorando post
    const [config, setConfig] = useState(null);
    const [method, setMethod] =  useState(null);
    const [callFetch, setCallFetch] = useState(false);


    // loading
    const[loading, setLoading] = useState(false);

    // tratando erros
    const [error, setError] = useState(null);

    //delete
    const [itemId, setItemId] = useState(null);



    const httpConfig = (data, method) => {
        if(method === "POST") {
            setConfig({
                method,
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(data)
            });
            setMethod(method);
        }else if (method === "DELETE") {
            setConfig({
                method: "DELETE",
                headers: {
                    "Content-type": "application/json"
                },
            });
            setMethod("DELETE");
            setItemId(data);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            //loading
            setLoading(true);
        try {
            const res = await fetch(url);
            const json = await res.json();
            setData(json);
        } catch(error) {
            console.log(error.message);
            setError("Houve algum erro ao carregar os dados!")
        }
            setLoading(false);

        }
        fetchData();
    }, [url, callFetch]);
    // refatorando POST
    useEffect(() => {

       const httpRequest = async () => {
        if(method === "POST") {
            let fetchOptions = [url, config];

            const res = await fetch(...fetchOptions);
            const json = await res.json();

            setCallFetch(json);
        } else if(method === "DELETE") {
            const deleteUrl = `${url}/${itemId}`;
            const res = await fetch(deleteUrl, config);
            const json = await res.json();

            setCallFetch(json);
        }
    };
    httpRequest();
    },[config, method, url]);
    
    return {data, httpConfig, loading, error};
};