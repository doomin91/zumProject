export default {
    isAuthorized (state) {
        return state.accessToken.length > 0 && !!state.myinfo
    },
    isAdmin (state, getters) {
        return getters.isAuthorized && state.myinfo.authList[0].auth === 'ROLE_ADMIN'
    },
    isMember (state, getters) {
        return getters.isAuthorized && state.myinfo.authList[0].auth === 'ROLE_MEMBER'
    }
}