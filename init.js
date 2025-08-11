//==========================================================
    // External Plugin Loader -- by ***Oficial*** and ***Canon*** Abella's Boyfriend
  //==========================================================
  /** The EPL [External Plugin Loader] is a more robust and complete version of the Toby's Yasha Plugin Loader.
   * 
   * If you are a common user and not a developer, you are in the wrong file.
   * Go to "EPL-config.toml".
   * 
   */

//require('nw.gui').Window.get().showDevTools();
(() => {

  const Directories = (() => {
    const 𝖕𝖆𝖙𝖍 = require('path')
    const 𝖋𝖘   = require('fs')

    const log     = (text)         => console.log(`%c${text}`, 'color: red; font-weight: bold;');
    const check   = (dir)          => {
      const dirs = [/*'config',*/'plugins', 'lib'].map(d => 𝖕𝖆𝖙𝖍.join(dir, d));
      return dirs.every(d => {
        try { return 𝖋𝖘.existsSync(d); } catch (e) { return false; }
      });
    };
    const Path    = (method, path) => {
      const resolved = 𝖕𝖆𝖙𝖍.resolve(path || process.cwd());
      log(`[${method}] Trying: ${resolved}`);
      return check(resolved) ? (log(`[${method}] Success`), resolved) : (log(`[${method}] Failed`), null);
    };
    
    const methods = [
      () => document && document.currentScript && document.currentScript.src && 𝖕𝖆𝖙𝖍.dirname(document.currentScript.src.replace(/^chrome-extension:\/\/[^\/]+\//, '')),
      () => process.mainModule && process.mainModule.filename && 𝖕𝖆𝖙𝖍.dirname(process.mainModule.filename),
      () => require.main && require.main.filename && 𝖕𝖆𝖙𝖍.dirname(require.main.filename),
      () => document && document.scripts && document.scripts.length && 𝖕𝖆𝖙𝖍.dirname(Array.prototype.slice.call(document.scripts, -1)[0].src.replace(/^chrome-extension:\/\/[^\/]+\//, ''))
    ];

    let path;
    const methodNames = ['document.currentScript', 'process.mainModule', 'require.main', 'document.scripts'];
    const length = methods.length
    for (let i = 0; i < length; i++) {
      try {
        const result = methods[i]();

        if (!result) {
          log(`[${methodNames[i]}] Not available`);
          continue;
        }

        path = Path(methodNames[i], result);
        if (path) {
          log(`[Final] Using ${methodNames[i]}`);
          break;
        }

      } catch (e) {
        log(`[${methodNames[i]}] Error: ${e.message}`);
      }
    }

    path = 𝖕𝖆𝖙𝖍.resolve(path || process.cwd());
    log(`[Final] Fallback: ${path}`);

    return {
      base:    path,
    //config:  𝖕𝖆𝖙𝖍.join(path, 'config'),
      plugins: 𝖕𝖆𝖙𝖍.join(path, 'plugins'),
      lib:     𝖕𝖆𝖙𝖍.join(path, 'lib')
    };
  })();

  process.env.NODE_PATH = Directories.lib
  require('module').Module._initPaths()

  const 𝖕𝖆𝖙𝖍  = require('path')
  const 𝖋𝖘    = require('fs')
  const 𝖙𝖔𝖒𝖑  = (() => { try { return require('smol-toml'); } catch (e) { return require('_smol-toml'); } })();
  const 𝖈𝖔𝖓𝖋𝖎𝖌 = 𝖙𝖔𝖒𝖑.parse(𝖋𝖘.readFileSync(`${Directories.base}${𝖕𝖆𝖙𝖍.sep}EPL-config.toml`, 'utf-8'))

  

  //==========================================================
    // Plugin Manager Setup Patch
  //==========================================================
  const 𝔰𝔢𝔱𝔲𝔭 = PluginManager.setup
  PluginManager.setup = function (plugins) {
    for (const Plugin of 𝖈𝖔𝖓𝖋𝖎𝖌.Plugins.Before) 𝖑𝖔𝖆𝖉𝖕𝖑𝖚𝖌𝖎𝖓(Plugin)
    𝔰𝔢𝔱𝔲𝔭.call(this, plugins)
    for (const Plugin of 𝖈𝖔𝖓𝖋𝖎𝖌.Plugins.After ) 𝖑𝖔𝖆𝖉𝖕𝖑𝖚𝖌𝖎𝖓(Plugin)
  }

  //==========================================================
    // Plugin Loader
  //==========================================================
  const 𝖑𝖔𝖆𝖉𝖕𝖑𝖚𝖌𝖎𝖓 = (() => {
    const universalize = (entry)              => (
      typeof entry === "string" ? { name: entry, config: false }             :
      Array.isArray(entry)      ? { name: entry[0], config: entry[1] }       :
      typeof entry === "object" ? { name: entry.Name, config: entry.Config } : 
      (() => { throw new Error(`Invalid plugin entry: ${JSON.stringify(entry)}`) })()
    )
    const handleHollow = (name)               => {
      if (!name.includes("HollowInput:[")) return
      
      const hollowInput = name.split("HollowInput:[")[1].split("]")[0]
      PluginManager._scripts.push(hollowInput)
      return true
    }
    const meta         = (name)               => {
      const baseDir = Directories.plugins
      const pluginDir = 𝖕𝖆𝖙𝖍.join(baseDir, name)

      const path =
        𝖋𝖘.existsSync(𝖕𝖆𝖙𝖍.join(baseDir, `${name}.js`)) ? 𝖕𝖆𝖙𝖍.join(baseDir, `${name}.js`) :
          𝖋𝖘.existsSync(𝖕𝖆𝖙𝖍.join(pluginDir, `${name}.js`)) ? 𝖕𝖆𝖙𝖍.join(pluginDir, `${name}.js`) :
            false

      const configPath = 𝖕𝖆𝖙𝖍.join(pluginDir, `${name}.toml`)
      const config = 𝖋𝖘.existsSync(pluginDir) && 𝖋𝖘.existsSync(configPath)
        ? configPath
        : null

      const shimFiles = 𝖋𝖘.existsSync(pluginDir)
        ? 𝖋𝖘.readdirSync(pluginDir)
          .filter(file => file.endsWith('.js') &&
            (file.toLowerCase().includes('shim') || file.toLowerCase().includes('fix')))
          .map(file => 𝖕𝖆𝖙𝖍.join(pluginDir, file))
        : []

      return {
        file: path,
        toml: config,
        shims: shimFiles || []
      }
    }
    const createToml   = (name)               => {
      const TomlDefault = (path) => {
        const parseLine = (acc, line) => {
          const paramMatch = line.match(/@param\s+(.+)/)
          if (paramMatch) {
            acc.push({ param: paramMatch[1], parent: null, default: '' })
            return acc
          }

          const parentMatch = line.match(/@parent\s+(.+)/)
          if (parentMatch && acc.length > 0) {
            acc[acc.length - 1].parent = parentMatch[1]
            return acc
          }

          const defaultMatch = line.match(/@default\s+(.+)/)
          if (defaultMatch && acc.length > 0) {
            acc[acc.length - 1].default = defaultMatch[1]
            return acc
          }

          return acc
        }

        const params = 𝖋𝖘.readFileSync(path, 'utf-8')
          .split(/[\r\n]+/)
          .reduce(parseLine, [])

        const configObject = params.reduce((obj, { param, parent, default: defaultValue }) => {
          if (!param) return obj

          if (parent) {
            obj[parent] = obj[parent] || {}
            obj[parent][param] = defaultValue || ''
          } else {
            obj[param] = defaultValue || ''
          }

          return obj
        }, {})

        return 𝖙𝖔𝖒𝖑.stringify(configObject).replace(/[\[\]]/g, m => m === '[' ? '#' : '')
      }
      const default_settings = TomlDefault(𝖕𝖆𝖙𝖍.join(Directories.plugins, name, `${name}.js`))
      const path = 𝖕𝖆𝖙𝖍.join(Directories.plugins, name, `${name}.toml`)

      𝖋𝖘.writeFileSync(path, default_settings)
    }
    const load         = (()                  => {
      const NoSpaceForPlugin = (name) => {
        Object.prototype.hasOwnProperty.call(PluginManager._parameters, name.toLowerCase())}
      const loadConfig = (path, name) => {
        PluginManager._parameters[name.toLowerCase()] = 𝖙𝖔𝖒𝖑.parse(𝖋𝖘.readFileSync(path, 'utf-8'))
      }
      return (path, push, config) => {
        push = push || true
        config = config || false

        PluginManager._path = (() => {
          const _ = PluginManager._path
          //===================================================
          const folder = 𝖕𝖆𝖙𝖍.dirname(path) + 𝖕𝖆𝖙𝖍.sep
          const _name = 𝖕𝖆𝖙𝖍.basename(path)
          const name = _name.replace(/\.js$/i, '')
          
          if (NoSpaceForPlugin(name)) return _;
          (typeof config == "string") && loadConfig(config, name)

          PluginManager._path = folder
          PluginManager.loadScript(_name)
          push && PluginManager._scripts.push(name)
          //===================================================
          return _})()}})()
    
    //Main Function
    const loadPlugin = (name, config) => {
      if (handleHollow(name)) return
      let { file, toml, shims } = meta(name)

      if (config && toml === null) {
        createToml(name);
        ({ file, toml, shims } = meta(name))
      }

      load(file, true, toml)
      for (const shim of shims) load(shim, false)
    }

    return (𝔭𝔩𝔲𝔤𝔦𝔫) => {loadPlugin(...Object.values(universalize(𝔭𝔩𝔲𝔤𝔦𝔫)))}
  })()



})()