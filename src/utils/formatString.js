export const formatString = (data) => { 
  return data?.slice(0, 1).toUpperCase().concat(data.slice(1))
}