function 小写下划线to小驼峰(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const originKeys = Object.keys(obj);
  const result = {};

  originKeys.forEach(key => {
	if(typeof obj[key] === 'object'){
		obj[key] = 小写下划线to小驼峰(obj[key])
	}
	
    const words = key.split("_");
    const newKey = words[0] + words.slice(1).map(word => word[0].toUpperCase() + word.slice(1)).join("");
    result[newKey] = obj[key];
  });

  return result;
}

export default {
	小写下划线to小驼峰
};
