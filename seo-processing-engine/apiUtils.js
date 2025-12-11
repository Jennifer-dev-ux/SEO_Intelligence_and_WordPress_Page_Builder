// apiUtils.js (FINAL ROBUST FIX FOR CERTIFICATE ERROR)

/**
 * Generic function to handle HTTP POST requests to the internal API.
 */
export async function postDataToAPI(endpointUrl, payload) {
    // 1. TEMPORARILY SET BYPASS (Final fix for DEPTH_ZERO_SELF_SIGNED_CERT error)
    // We set this here to ensure it's active for every API call made by this function.
    const originalRejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    try {
        const response = await fetch(endpointUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(payload)
        });

        // 2. RESTORE BYPASS SETTING
        if (originalRejectUnauthorized === undefined) {
            delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        } else {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalRejectUnauthorized;
        }

        // Check for non-successful HTTP status
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API POST FAILED at ${endpointUrl}: Status ${response.status}. Details: ${errorText}`);
            return { success: false, message: `HTTP Error: ${response.status}`, details: errorText };
        }

        // Return the API's JSON response
        return await response.json(); 

    } catch (error) {
        console.error(`Network or fetch error for ${endpointUrl}:`, error);
        
        // 2b. ENSURE BYPASS IS RESTORED EVEN IF AN ERROR OCCURS
        if (originalRejectUnauthorized === undefined) {
            delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        } else {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalRejectUnauthorized;
        }
        
        return { success: false, message: 'Network/Fetch Error', details: error.message };
    }
}