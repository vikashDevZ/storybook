const lessToJs = require("less-vars-to-js");
/**
 * Convert Less Variables in JSON Format to SASS
 * @param {*} lessVariables
 * @returns
 */
function lessToSass(lessVariables) {
  lessVariables = lessToJs(lessVariables);
  let value = "";
  let obj = {};
  //Replace less @ by ''
  for (var key in lessVariables) {
    value = lessVariables[key];
    key = key.replace("@", "");
    obj[key] = value;
  }
  // Make object root properties into sass variables
  var sass = "";
  for (var key in obj) {
    //sass += "$" + key + ":" + JSON.stringify(obj[key], null, indent) + ";\n";
    sass += "$" + key + ":" + obj[key] + ";\n";
  }

  // Store string values (so they remain unaffected)
  var storedStrings = [];
  sass = sass.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, function (str) {
    var id = "___JTS" + storedStrings.length;
    storedStrings.push({ id: id, value: str });
    return id;
  });

  // Convert js lists and objects into sass lists and maps
  sass = sass.replace(/[{\[]/g, "(").replace(/[}\]]/g, ")");

  // Put string values back (now that we're done converting)
  storedStrings.forEach(function (str) {
    sass = sass.replace(str.id, str.value);
  });

  return {
    lessVariables,
    sassVariables: sass,
  };
}

function getTotalDependencyMap(packageFile) {
  function getDependencies(packageJson, output) {
    output = { ...output, ...packageJson.dependencies };
    Object.keys(packageJson.dependencies || {}).map((key) => {
      if (packageJson.dependencies[key].startsWith("file:")) {
        output = {
          ...output,
          ...getDependencies(
            require(process.cwd() + "/node_modules/" + key + "/package.json")
          ),
        };
      }
    });
    return output;
  }

  return getDependencies(packageFile, {});
}

module.exports = { lessToSass, getTotalDependencyMap };
