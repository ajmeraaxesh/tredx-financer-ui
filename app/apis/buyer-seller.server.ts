

const BUYER_SELLER_URL = "";


export const getUserList = async (request) => {
    const response = await fetch(`${BUYER_SELLER_URL}/api/settings/user/list`, {
        method: 'POST',
        headers: {
            ...commonHeaders
        },
        body: JSON.stringify(apiBody),
    })

    const data = await response.json()
    //console.log("JSON data ",   data)
    return data
}
