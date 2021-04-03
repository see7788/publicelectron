import {
  app,
  dialog,
  Menu,
  Cookie,
  Notification,
  webContents,
  MenuItemConstructorOptions,
  BrowserWindow,
  Tray,
} from "electron";
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'//关闭electron警告
function dirSetting({
  title = "图片存储目录",
  iconPath,
  pathGet,
  pathSet
}: {
  title: string,
  iconPath: string,
  pathGet: () => string | void,
  pathSet: (...dir: string[]) => void
}): Promise<string> {
  return new Promise((ok, err) => {
    const c = pathGet();
    if (c) {
      ok(c);
    } else {
      title = "请选择" + title;
      dialog
        .showOpenDialog({
          title,
          defaultPath: app.getPath("downloads"), // 打开文件选择器的哪个路径 需要输入一个有效路径
          // buttonLabel: "文件就放这里",
          properties: ["openDirectory"],
          message: title,
        })
        .then(async ({ canceled, filePaths }) => {
          if (!canceled) {
            const c = filePaths[0] ? filePaths[0] : "";
            pathSet(c);
            ok(c);
          } else {
            new Notification({
              title: "错误",
              body: "你没有选择" + title,
              icon: iconPath,
            }).show();
            err("没有" + title);
          }
        });
    }
  });
}
const cookiesOn = ({
  webObj,
  cookiesGet,
  cookiesSet,
}: {
  webObj: webContents,
  cookiesGet: () => Cookie[] | void,
  cookiesSet: (c: Cookie[]) => void
}): Promise<void> => new Promise(async (ok, err) => {
  const webCookie = webObj.session.cookies;
  //必须在loadUrl前才有效果
  const log = (name: string) => {
    const cs = cookiesGet();
    console.log([name, cs && Object.keys(cs).length, typeof cs]);
  };
  const c = cookiesGet()
  if (c) {
    c.forEach(cookiesItem => {
      const { secure = false, domain = "", path = "" } = cookiesItem;
      webCookie.set({
        ...cookiesItem,
        url:
          (secure ? "https://" : "http://") +
          domain.replace(/^\./, "") +
          path,
      }
      ).catch(e => err({
        message: "恢复cookie失败",
        cookie: cookiesItem,
        errorMessage: e.message,
      }))
    })
    log("cookie 恢复结束");
  } else {
    log("cookie 没有可恢复的");
  }
  let oning: NodeJS.Timeout;
  webCookie.on("changed", () => {
    if (oning) {
      clearTimeout(oning);
    }
    oning = setTimeout(() => {
      try {
        webCookie.get({}).then((cookies) => {
          cookiesSet(cookies);
          log("cookie 存储了");
        });
      } catch (error) {
        console.log({ error });
      }
    }, 800);
  });
  ok()
})
export default {cookiesOn,dirSetting}
// https://www.electronjs.org/docs/api/cookies

// let promise = new Promise((resolve) => {
//   let cookies = store.get(sessionCookieStoreKey) || [];
//   let recoverTimes = cookies.length;
//   if (recoverTimes <= 0) {
//       //无cookie数据无需恢复现场
//       resolve()
//       return;
//   }
//   //恢复cookie现场
//   cookies.forEach((cookiesItem) => {
//       let {
//           secure = false,
//           domain = '',
//           path = ''
//       } = cookiesItem

//       browserWindow.webContents.session.cookies
//           .set(
//               Object.assign(cookiesItem, {
//                   url: (secure ? 'https://' : 'http://') + domain.replace(/^\./, '') + path
//               })
//           )
//           .then(() => {
//           })
//           .catch((e) => {
//               console.error({
//                   message: '恢复cookie失败',
//                   cookie: cookiesItem,
//                   errorMessage: e.message,
//               })
//           })
//           .finally(() => {
//               recoverTimes--;
//               if (recoverTimes <= 0) {
//                   resolve();
//               }
//           })
//   });
// })
// promise.then(() => {
//   //监听cookie变化保存cookie现场
//   return new Promise((resolve) => {
//       let isCookiesChanged = false;
//       browserWindow.webContents.session.cookies.on('changed', () => {
//           //检测cookies变动事件，标记cookies发生变化
//           isCookiesChanged = true;
//       });

//       //每隔500毫秒检查是否有cookie变动，有变动则进行持久化
//       setInterval(() => {
//           if (!isCookiesChanged) {
//               return;
//           }
//           browserWindow.webContents.session.cookies.get({})
//               .then((cookies) => {
//                   store.set(sessionCookieStoreKey, cookies);
//               })
//               .catch((error) => {
//                   console.log({error})
//               })
//               .finally(() => {
//                   isCookiesChanged = false;
//               })
//       }, 500);

//       resolve();
//   })
// })



// import Shell from 'node-powershell';
 
// const ps = new Shell({debugMsg:true});
 
// ps.addCommand('echo node-powershell');
// ps.invoke()
// .then(output => {
//   console.log('.........',output);
// })
// .catch(err => {
//   console.log('3333',err);
// });