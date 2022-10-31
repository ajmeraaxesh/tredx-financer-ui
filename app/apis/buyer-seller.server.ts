
import { getApiCommonHeaders } from "~/session.server"
const BUYER_SELLER_URL = process.env.BUYER_SELLER_URL




// export const getUserList = async (request) => {
    //     const response = await fetch(`${BUYER_SELLER_URL}/api/settings/user/list`, {
        //         method: 'POST',
        //         headers: {
            //             ...commonHeaders
            //         },
            //         body: JSON.stringify(apiBody),
            //     })

            //     const data = await response.json()
            //     //console.log("JSON data ",   data)
            //     return data
            // }
//TODO: Get types from buyer-seller entity and map it out
export const getApprovedBuyersAndSellers = async (request: Request ,filters = {}, pageSize = 100) => {
    const commonHeaders = await getApiCommonHeaders(request)
    const response = await fetch(`${BUYER_SELLER_URL}/entity?filters={"adminApproval":"1"}&limit=${pageSize}`, {
        method: 'GET',
        headers: {
            ...commonHeaders
        },
    })

    const data = await response.json()
    return data
}