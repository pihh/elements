export const getIfSetup = function (connection, stack = []) {
  let query = connection.replace("(", "").trim();
  if (query.charAt(query.length - 1) === ")") {
    query = query.substring(0, query.length - 1);
  }

  let attributes = query.split(' ').map(el => el.trim()).filter(el => el.length > 0).filter(el => ['?',':','"',"'",'`'].reduce((value,item)=> {
  
    let isIdx = el.indexOf(item)>-1 ? 1:0;
    return value+isIdx
}, 0) == 0).filter(el => isNaN(el)).map(el => el.trim().replaceAll('this.','').replaceAll('!',''));




  let setup = {
    success: true,
    query: query,
    attribute: attributes
  };


  return setup;
};
