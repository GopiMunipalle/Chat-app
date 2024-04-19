import mongoose , {connect} from 'mongoose'
import { config } from 'dotenv'
config()

let uri=process.env.URI
let testUri=process.env.TESTURI

const connectDb=async()=>{
    try {
        await connect(`${uri}`)
        console.log('db is connected')
        return Promise.resolve()
    } catch (error) {
        console.log('error at database',error)
        return Promise.reject()
    }
}

 const testDb=async()=>{
    try {
        await connect(`${testUri}`)
        return Promise.resolve()
    } catch (error) {
        console.log('error at database',error)
        return Promise.reject()
    }
}

export default {connectDb,testDb}