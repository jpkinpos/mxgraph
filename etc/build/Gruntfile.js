const decomment = require("decomment");
const fs = require("fs");
const path = require("path");

const flatten = arr =>
  arr.reduce(
    (acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val),
    []
  );

Array.prototype.flatten = function() {
  return flatten(this);
};

const walkSync = dir =>
  fs
    .readdirSync(dir)
    .map(
      file =>
        fs.statSync(path.join(dir, file)).isDirectory()
          ? walkSync(path.join(dir, file))
          : path.join(dir, file).replace(/\\/g, "/")
    )
    .flatten();

const regFilter = (arr, filter) =>
  arr.filter(item =>
    (filter instanceof RegExp ? filter : new RegExp(filter, "gi")).test(item)
  );

const parentFolderName = path.basename(path.resolve(".."));

module.exports = function(grunt) {
  const files = regFilter(
    walkSync(path.join(process.cwd(), "javascript/src/js")),
    /\.js$/
  );
  const modules = files.map(file => path.basename(file, ".js"));
  const subModules = {
    mxCellAttributeChange: "mxGraphModel",
    mxChildChange: "mxGraphModel",
    mxCollapseChange: "mxGraphModel",
    mxCurrentRootChange: "mxGraphView",
    mxGeometryChange: "mxGraphModel",
    mxHierarchicalEdgeStyle: "mxHierarchicalLayout",
    mxRootChange: "mxGraphModel",
    mxSelectionChange: "mxGraphSelectionModel",
    mxStyleChange: "mxGraphModel",
    mxTerminalChange: "mxGraphModel",
    mxValueChange: "mxGraphModel",
    mxVisibleChange: "mxGraphModel"
  };
  const nonModules = ["mxDisabled", "mxPlainTextEditor"];
  const undefinedModules = [];

  let distContent = `
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  }
  else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  }
  else {
    root.mxgraph = factory();
  }
} (this, function () {
  return function (opts) {
    var options = require('./getOptions')(opts);

    var mxNamespace = {};

    mxNamespace.mxClient = require('./mxClient')(options, true);
`;

  grunt.initConfig({
    clean: ["./javascript/dist"],
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: "./javascript/src",
            src: "**/*.js",
            dest: "./javascript/dist",
            flatten: true
          }
        ],
        options: {
          process: function(content, srcpath) {
            const moduleName = path.basename(srcpath, ".js");
            const isCodecDefinition =
              moduleName !== "mxCodec" &&
              moduleName !== "mxObjectCodec" &&
              moduleName.endsWith("Codec");
            const isMxClient = moduleName === "mxClient";

            if (isMxClient) {
              content = content.replace(
                /mxClient\.include\([^"']+["'](.*?)["']\);/gi,
                ""
              );
            }

            const cleanContent = decomment(content);

            const selfDefined = cleanContent.match(new RegExp(moduleName, "g"))
              ? true
              : false;

            if (isCodecDefinition && !selfDefined) {
              content = content.replace(
                /mxCodecRegistry\.register\(function\(\)/g,
                "var " + moduleName + " = mxCodecRegistry.register(function()"
              );
            }

            const extraDefinitionsMatch = cleanContent.match(
              /(function\s(mx[A-Z]\w+)|var\s(mx[A-Z]\w+))/g
            );

            const extraDefinitions = (extraDefinitionsMatch || [])
              .map(value => value.replace(/(function\s|var\s)/gi, ""))
              .filter(
                (value, index, self) =>
                  value !== moduleName && self.indexOf(value) === index
              );

            const moduleUndefinedModules = cleanContent
              .match(/\smx[A-Z]\w+/g)
              .map(value => value.trim())
              .filter(
                (value, index, self) =>
                  value !== moduleName &&
                  !modules.includes(value) &&
                  !subModules[value] &&
                  self.indexOf(value) === index
              );

            if (moduleUndefinedModules && moduleUndefinedModules.length) {
              moduleUndefinedModules
                .sort()
                .forEach(
                  value =>
                    !undefinedModules.includes(value) &&
                    undefinedModules.push(value)
                );
              // console.log(moduleName, " => ", moduleUndefinedModules.join(", "));
            }

            const requires = cleanContent
              .match(/\smx[A-Z]\w+/g)
              .map(value => value.trim())
              .filter(
                (value, index, self) =>
                  value !== moduleName &&
                  (modules.includes(value) || subModules[value]) &&
                  self.indexOf(value) === index
              )
              .sort()
              .map(value => {
                const req = subModules[value] || value;
                const sub = subModules[value] ? "." + value : "";
                return `var ${value} = require('./${req}')(options, true)${sub};`;
              })
              .join("\n");

            if (!isMxClient) {
              distContent += `\n    mxNamespace.${moduleName} = require('./${moduleName}')(options, true);`;
              extraDefinitions.forEach(
                value =>
                  (distContent += `\n    mxNamespace.${value} = mxNamespace.${moduleName}.${value};`)
              );
            }

            return `module.exports = function ${moduleName}Factory(opts, merged) {
var options = merged ? (opts || {}) : require('./getOptions')(opts);

${requires}

for (var name in Object.keys(options)) {
  this[name] = options[name];
}

${content}

${extraDefinitions
  .map(value => `${moduleName}.${value} = ${value};`)
  .join("\n")}

return ${moduleName};
};`;
          }
        }
      }
    },
    webpack: {
      examples: {
        entry: "./javascript/examples/webpack/src/anchors.js",
        output: {
          path: path.resolve(
            process.cwd(),
            "./javascript/examples/webpack/dist"
          ),
          filename: "anchors.js"
        }
      }
    },
    watch: {
      javascripts: {
        files: "javascript/src/**/*.js",
        tasks: ["umdify"],
        options: {
          interrupt: true
        }
      }
    }
  });

  require(parentFolderName === "node_modules"
    ? "load-grunt-parent-tasks"
    : "load-grunt-tasks")(grunt);

  grunt.registerTask("finalize", "", function finalize(opts) {
    distContent += `

    return mxNamespace;
  };
}))`;
    fs.writeFileSync(
      path.join(process.cwd(), "javascript/dist/build.js"),
      distContent
    );
    fs.writeFileSync(
      path.join(process.cwd(), "javascript/dist/mxDefaultOptions.js"),
      `module.exports = function mxDefaultOptionsFactory() {
  return {
    mxLoadResources: true,
    mxForceIncludes: false,
    mxResourceExtension: '.txt',
    mxLoadStylesheets: true,
    mxBasePath: '.',
    mxImageBasePath: './images',
    mxLanguage: null,
    mxDefaultLanguage: 'en',
    mxLanguages: ['en']
  };
};`
    );
    fs.writeFileSync(
      path.join(process.cwd(), "javascript/dist/getOptions.js"),
      `module.exports = function getOptions(options) {
  return Object.assign(require('./mxDefaultOptions')() || {}, options || {});
};`
    );
    // console.log('Undefined module(s): ', undefinedModules.sort().join(', '));
  });

  grunt.registerTask("default", ["clean", "copy", "finalize", "webpack"]);
  grunt.registerTask("build", ["default"]);
};
