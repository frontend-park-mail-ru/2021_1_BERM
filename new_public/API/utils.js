export default {
     numberPathFunc (path, arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].test(path)) {
                return i;
            }
        }
        return -1;
    }
}
