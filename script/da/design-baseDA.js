class BaseDA {
  static async getFile(url) {
    let authenAccessToken = UserService.getToken();
    let headers = {
      token: `${authenAccessToken ?? ""}`,
      pid: `${ProjectDA.obj.ID}`,
    };
    let result = await fetch(url, {
      method: "get",
      headers: headers,
    });
    console.log(result);
    return result;
  }

  static async uploadFile(listFile, url, collectionId) {
    listFile = [...listFile];
    let _date = new Date();
    let headers = await UserService.headerFile();
    headers.folder = UserService.getUser().id;
    headers.collectionId = collectionId;
    headers.code = ProjectDA.obj.Code;
    headers.datee = `${_date.getFullYear()}${_date.getMonth()}${_date.getDate()}`;
    let listFileResult = [];
    for (let i = 0; i < Math.ceil(listFile.length / 5); i++) {
      const formData = new FormData();
      let endIndex = i * 5 + 5;
      if (listFile.length < endIndex) {
        endIndex = listFile.length;
      }
      let sliceList = listFile.slice(i * 5, endIndex);
      for (let j = 0; j < sliceList.length; j++) {
        formData.append("files", sliceList[j]);
      }
      let result = await fetch(url, {
        method: "post",
        headers: headers,
        body: formData,
      }).then((res) =>
        res.json()
      );
      listFileResult.push(...result);
    }
    return listFileResult;
  }
}