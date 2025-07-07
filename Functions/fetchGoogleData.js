const fetchUserInfo = async (accessToken) => {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`Google API error: ${res.status} ${res.statusText}`);
    }
    return await res.json(); 
  } catch (error) {
    console.error('fetchUserInfo error:', error);
    throw error;
  }
};

export default fetchUserInfo;
