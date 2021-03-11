import { useEffect, useState } from 'react';

const useConnectWeb3 = async () => {
    if (!connectWeb3Flag) return;

    // Get network provider and web3 instance.
    const web3 = await getWeb32()
        .then(() => {
            setWeb3(web3)
        })
        .catch(error => {
            // Catch any errors for any of the above operations.
            alert( `Failed to load web3, accounts, or contract. Check console for details.`, );
            console.error(error);
            
        })
        .finally(() => {
            setConnectWeb3Flag(false);
        })
    return web3;
}




const useConnectWeb3 = (connectWeb3Flag) => {
    const [ web3, setWeb3 ] = useState(null);
    const [ err, setErr ] = useState(null);

    useEffect(() => {
        debugger;
        if (!connectWeb3Flag) return;
    
        connectWeb3();
        
    }, [ connectWeb3Flag ]);

    return [ web3, err ] 
}