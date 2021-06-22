const AccessController = require('orbit-db-access-controllers/src/access-controller-interface')
// receive a dao contract,
// check signature in entry
// validate address in contract
// perform entry
export default class OtherAccessController extends AccessController {

    constructor (orbitdb, options) {
      super()
      this._orbitdb = orbitdb
      this._db = null
      this._options = options || {}
    }
    
    static get type () { return 'othertype' } // Return the type for this controller

    async canAppend(entry, identityProvider) {
      console.log('entry:',entry)
      console.log('identityProvider: ',identityProvider)
      console.log(this)
      // Write keys and admins keys are allowed
      // const access = new Set([...this.get('write'), ...this.get('admin')])

      // if (access.has(entry.identity.id) || entry.payload.value.value === "request") {
      //   const verifiedIdentity = await identityProvider.verifyIdentity(entry.identity)
      //   // Allow access if identity verifies
      //   return verifiedIdentity
      // }
      // logic to determine if entry can be added, for example:
      // do a call to a DAO contract, verify membership
      if (entry.payload.value.value === "request")
        return true

      return false
      }

    async grant (access, identity) {} // Logic for granting access to identity

    async save () {
      // return parameters needed for loading
      return { parameter: 'some-parameter-needed-for-loading' }
    }

    static async create (orbitdb, options) {
      return new OtherAccessController()
    }
}

// AccessControllers.addAccessController({ AccessController: OtherAccessController })

// const orbitdb = await OrbitDB.createInstance(ipfs, {
//   AccessControllers: AccessControllers
// })

// const db = await orbitdb.keyvalue('first-database', {
//   accessController: {
//     type: 'othertype',
//     write: [id1.id]
//   }
// })
