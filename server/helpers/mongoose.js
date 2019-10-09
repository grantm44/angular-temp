module.exports = {
    normalizeErrors: function(errors) {
        let errorArr = [];
        for(let prop in errors){
            if(errors.hasOwnProperty(prop)){
                errorArr.push({title: prop, detail: errors[prop].message})
            }
        }
        return errorArr;
    }
}