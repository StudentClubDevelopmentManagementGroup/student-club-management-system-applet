/**
 * 将对象的键名从小写下划线格式转换为小驼峰格式
 * @param {Object} obj - 要转换键名的对象
 * @returns {Object} - 返回转换后键名为小驼峰格式的新对象
 */
function changeNameFromLowerSnakeToCamel(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const originKeys = Object.keys(obj);
  const result = {};

  originKeys.forEach(key => {
	if(typeof obj[key] === 'object'){
		obj[key] = changeNameFromLowerSnakeToCamel(obj[key])
	}
	
    const words = key.split("_");
    const newKey = words[0] + words.slice(1).map(word => word[0].toUpperCase() + word.slice(1)).join("");
    result[newKey] = obj[key];
  });

  return result;
}

export default {
	changeNameFromLowerSnakeToCamel
};
