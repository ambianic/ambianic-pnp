//Generate error messages and codes 
const generateServerCode = (res, code, err_msg, msg, location = "server") => {

    //Display erros in json
    const errors = {}

    //Display errors with err_msg and msg  in json format
    errors[location] = {
        err_msg,
        msg
    }

    //Return err message and code
    return res.status(code).json({
        code,
        err_msg,
        errors,
    });
}
module.exports = generateServerCode