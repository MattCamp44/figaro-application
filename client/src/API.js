const baseURL = `/api`;

/*
*   Not catching errors here.. must be checked in the components
*/

const get = async (resource, query = '') => await (await fetch(`${baseURL}/${resource}${query}`)).json();
const patch = async (resource, body, { encoding } = { encoding: true }) => await (await fetch(`${baseURL}/${resource}`, {
  method: 'PATCH',
  headers: encoding ? { 'Content-Type': 'application/json' } : {},
  body: encoding ? JSON.stringify(body) : body
})).json();
const put = async (resource, body, { encoding } = { encoding: true }) => await (await fetch(`${baseURL}/${resource}`, {
  method: 'PUT',
  headers: encoding ? { 'Content-Type': 'application/json' } : {},
  body: encoding ? JSON.stringify(body) : body
})).json();

export const getUser = async () => {
  return await get('user');
};

export const getVoiceTypes = async (gender) => {
  return await get('voices', `?gender=${gender}`);
};

export const setVoiceType = async (voice) => {
  const res = await fetch(`${baseURL}/user`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ voice })
  });
  return res.status === 200;
};

export const getExercises = async () => {
  return await get('exercises');
};

export const getFavorites = async () => {
  return (await get('exercises')).filter(ex => ex.favorite);
};

export const setFavorite = async ({ id, favorite }) => {
  return await patch(`exercises/${id}`, { favorite });
};

export const uploadAvatar = async ({ file }) => {
  const formData = new FormData();
  formData.append('file', file);

  return await put(`avatar`, formData, { encoding: false });
};

export const getStatistics = async () => {
  return await get('statistics');
};

export const setStatistics = async (id, scoreData) => {
  return await put(`statistics/${id}`, scoreData);
}
