const Rule = () => {
    return (
        <>
            <p>
                git remote：查看当前连接的代码仓库，<br />
                git clone：克隆一个git仓库<br />
                git status：查看文件的状态<br />
                git branch：创建一个分支，后面有分支名就创建，没有就查看本地分支，加上-r参数可以查看远程分支，-d参数可以删除分支<br />
                git checkout 分支名：切换到该分支<br />
                git merge 分支名：将任意分支合并到当前分支中<br />
                git fetch：获取远程仓库新建分支<br />
                git log  查看提交记录<br />
            </p>
        </>
    );
};
export default Rule;