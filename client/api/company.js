import http from './http';
import VueCookies from 'vue-cookies'

http.defaults.headers.common.accessToken = VueCookies.get('accessToken')


/**
 * 
 * USER API REQUEST 
 * 
 */

export async function getUserList (data){
    return http.post('/api/getUserList', data);
}

export async function getUser (seq){
    return http.get('/api/getUser' + `?userSeq=${seq}`)
}

export async function deleteUser (data){
    return http.post('/api/deleteUser', data);
}

export async function modifyUser (data){
    return http.post('/api/modifyUser', data);
}

export async function registUser (data){
    return http.post('/api/registUser', data);
}

export async function getAdminList(data){
    return http.post('/api/getAdminList', data)
}

export async function modifyAuth(data){
    return http.post('/api/modifyAuth', data);
}

/**` 
 * 
 * DEPART API REQUEST 
 * 
 */

export async function getDepartList (){
    return http.get('/api/getDepartList');
}

export async function getDepartChart (){
    return http.get('/api/getDepartChart');
}

export async function insertChildren(data) {
    return http.post('/api/insertChildren', data);
}

export async function updateDepart(data) {
    return http.post('/api/updateDepart', data);
}

export async function deleteDepart(data) {
    return http.post('/api/deleteDepart', data);
}

export async function getUsersInDepart(data) {
    return http.post('/api/getUsersInDepart', data);
}

export async function addAdminUser(data) {
    return http.post('/api/addAdminUser', data);
}

export async function searchAdmin(data){
    return http.post('/api/searchAdmin', data);
}

/**
 * 
 * POSITION API REQUEST 
 * 
 */

export async function getPositionList (){
    return http.get('/api/getPositionList');
}