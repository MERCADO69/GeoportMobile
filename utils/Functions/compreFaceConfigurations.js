import ValidateId from "../../Functions/validateImage";
import ValidateFace from "../../Functions/verifyImage"

class CompreFaceServices{

    constructor(){
        this.validate_id = new ValidateId()
        this.validate_face = new ValidateFace()
    }


    duplicateFaceChecker(metadata){
        return metadata.faces.length === 1;
    }
    
}

export default CompreFaceServices;