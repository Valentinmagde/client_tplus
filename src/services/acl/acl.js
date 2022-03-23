import Vue from "vue"

import { AclInstaller, AclCreate, AclRule } from "vue-acl"

import router from "@/router"

import store  from '@/store'

Vue.use(AclInstaller)

const checkRole = () => {

  let access = (store.state.association.userRoles) ? Array.from(store.state.association.userRoles): []

  if( access.includes("Contrôleur Financier") || access.includes("Financier") ||
      access.includes("Administrateur")  )
  {
    let accessRoles = []
    if( access.includes("Contrôleur Financier") )
      accessRoles.push("Contrôleur Financier")

    if( access.includes("Administrateur") )
      accessRoles.push("Administrateur")

    if( access.includes("Financier") )
      accessRoles.push("Financier")

    return accessRoles

  }else
    return false

}


const callback = () => false

const updateAccess = (access, acl) => {

  if( access.includes("Administrateur")){
      acl.change(['superAdmin', 'financial', 'controler', 'editor'])
      return true;
  }

  if( access.includes("Financier")){
      acl.change(['financial', 'controler', 'editor'])
      return true;
  }
  if( access.includes("Contrôleur Financier")){
      acl.change(['controler', 'editor'])
      return true;
  }
}

const checkIfCurrentExist = async (acl) => {
  const currentAss = store.getters['association/getCurrentAssociation']

  if (currentAss){
    return await store.dispatch('association/FETCH_USER_ASSOCIATION_ROLES', {
              association: currentAss.id,
              user: store.getters['authentificated/getAuth'].id
          })
          .then(e =>{
            if (e){
              updateAccess(Array.from(e), acl)
              //store.commit('authentificated/SET_USER_ROLES', Array.from(e))
            }
          })
          .then(() => callback() )
        }else
          callback()
}

const checkCretendials = async (acl) => {

  const payload = {
    userUUID: store.getters['authentificated/getAuth'].id
  }
  return await store.dispatch('association/FETCH_USER_ASSOCIATION',payload)
      .then(()=> checkIfCurrentExist(acl))
      .catch(() => callback())
}



export default new AclCreate({
  initial: "editor",
  notfound: "/user/unauthorized",
  router,
  acceptLocalRules: true,
  globalRules: {
    editor: new AclRule("editor").or("admin").generate(),
    isControler: new AclRule("controler").and("editor").generate(),
    isFinancial: new AclRule("financial").and("controler").and("editor").generate(),
    isAdmin: new AclRule("superAdmin").and("financial").and("editor").generate(),

  },


  middleware: async acl => {
    const currentRoles = checkRole()

    if ( currentRoles != false)
      updateAccess(currentRoles, acl)
    else{
      await store.dispatch('authentificated/INITIALIZE')
      .then(e => {

        if(e)
          return checkCretendials(acl)
        else
           return callback()
      })
    }
  }
})
