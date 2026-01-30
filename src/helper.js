export const getQueryParam = (key) => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(key)
}

export const postToGoogleSheets = async (url, data) => {
  return await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    body: data,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
