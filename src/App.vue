<template>
  <div id="app">
    <div class="header">
        <h1>ToDo</h1>
    </div>
    <div class="main">
        <div class="left">
            <div v-bind:class="[listtitle, alltasks, isAllTaskActive ? active : '']" v-on:click="allTask">
              所有任务 ({{num}})
            </div>
            <div class="list-title">分类列表</div>
            <div id="listcontent" class="list">
                <ul>
                    <li v-for="cate in cates">
                        <h2 v-on:click="cateClick(cate)" v-bind:class="{'active':cate.isActive}"><i class="fa fa-folder-open"></i><span>{{cate.name}}</span> ({{cate.childCate.length}})</h2>
                        <ul>
                            <li v-for="child in cate.childCate">
                                <h3 v-bind:class="{'active':child.isActive}" v-on:click="childClick(child)"><i class="fa fa-file-o"></i><span>{{child.name}}</span> ({{child.tasks.length}})</h3>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <button class="add" v-on:click="clickAddCate"><i class="fa fa-plus"></i>新增分类</button>
        </div>
        <div class="mid">
            <div class="status">
                <button id="all-tasks" class="active" v-on:click="allTasksClick()">所有</button>
                <button id="unfinish-tasks" class="" v-on:click="unfinishTaksClick()">未完成</button>
                <button id="finished-tasks" class="" v-on:click="finishedTasksClick()">已完成</button>
            </div>
            <div id="task-list" class="task-list">
                <div v-for="tasks in taskList">
                    <div>{{tasks.date}}</div>
                    <ul>
                        <li v-for="task in tasks.tasks" v-bind:class="{'active':task.isActive,'task-done':task.isFinished}" v-on:click="taskClick(task)"><i class="fa fa-check" v-show="task.isFinished"></i>{{task.name}}</li>
                    </ul>
                </div>
            </div>
            <button class="add-task add" v-on:click="addTask()"><i class="fa fa-plus"></i>新增任务</button>
        </div>
        <div class="right">
            <div class="title">
                <div class="todo-name" v-show="!editing">{{currentTask.name}}</div>
                <div class="todo-name" id="todoName" v-show="editing"><input type="text" class="input-title" placeholder="请输入标题" v-model="currentTask.name"></div>
                <div class="manipulate">
                    <a v-on:click="checkClick()"><i class="fa fa-check-square-o"></i></a>
                    <a v-on:click="pencilClick()"><i class="fa fa-pencil-square-o"></i></a>
                </div>
            </div>
            <div class="task-date" v-show="!editing">
                任务日期：<span>{{currentTask.date}}</span>
            </div>
            <div class="task-date" v-show="editing" id="taskDate">
                任务日期：<span><input type="date" class="input-date" v-model="currentTask.date"></span>
            </div>
            <div class="content" v-show="!editing">
                {{currentTask.content}}
            </div>
            <div class="content" v-show="editing">
                <textarea class="textarea-content" placeholder="请输入任务内容" id="textareaContent" v-model="currentTask.content"></textarea>
            </div>
            <div class="button-area" v-show="editing">
                <span class="info"></span>
                <button class="save" v-on:click="saveClick()">保存</button>
            </div>
        </div>
    </div>
    <div class="cover" v-show="isCover">
        <div class="modal">
            <div class="modal-head">
                新增分类
            </div>
            <div class="modal-body">
                选择主分类：
                <select id="modal-select">
                    <option >新增主分类</option>
                    <option v-for="cate in cates">{{cate.name}}</option>
                </select>
                <br>
                新分类名称：
                <input id="newCateName" type="text" v-model="message">
            </div>
            <div class="modal-foot">
                <button v-on:click="cancel">取消</button>
                <button v-on:click="ok">确认</button>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import Store from './store'
require('./assets/font.css')
require('./assets/style.css')
export default {
    data: function () {
      return {
        editing: false,
        currentCate: {},
        currentCateTable: "", 
        // cate,childCate
        currentTask: {},
        listtitle: "list-title",
        alltasks: "all-tasks",
        active: "active",
        isAllTaskActive: false,
        message: '',
        cates: Store.fetch([
            {
                name: "默认分类",
                isDefault: true,
                isActive: false,
                childCate: [{
                    name: "默认子分类",
                    isActive: true,
                    tasks: [{
                        name: "使用说明",
                        isActive: false,
                        date: "2016-09-15",
                        content: "基于vue.js开发的练习项目，数据将存储在浏览器本地存储;左侧为分类列表;中间为当前分类下的任务列表;右侧为任务详情;可以添加分类，添加任务，修改任务，以及给任务标记是否完成等功能",
                        isFinished: true
                    }]
                }]
            },
            {
                name: "工作",
                isDefault: false,
                isActive: false,
                childCate: [{
                    name: "前端",
                    isActive: false,
                    tasks: [{
                        name: "sass",
                        isActive: false,
                        date: "2016-09-16",
                        content: "学习sass",
                        isFinished: false
                    },{
                        name: "vue",
                        isActive: false,
                        date: "2016-09-17",
                        content: "学习vue.js",
                        isFinished: false
                    }]
                }]
            }
        ]),
        taskList: [{
            date: "2016-09-15",
            tasks: [{
                name: "使用说明",
                isActive: false,
                date: "2016-09-15",
                content: "我是使用说明",
                isFinished: true
            }]
        }],
        isCover: false
        // tasks: this.cates[0].childCate[0].tasks
      }
    },
    watch: {
        cates: {
            handler: function (cates) {
                Store.save(cates)
            }
        },
        deep: true
    },

    computed: {
        num: function () {
            var result = 0
            for (var i = 0; i < this.cates.length; i++) {
                for (var j = 0; j < this.cates[i].childCate.length; j++) {
                    result += this.cates[i].childCate[j].tasks.length
                }
            }
            return result
        }
    },
    methods: {
        toggleInit: function () {
            this.isAllTaskActive = false
            for (var i = 0; i < this.cates.length; i++) {
                this.cates[i].isActive = false
                for (var j = 0; j < this.cates[i].childCate.length; j++) {
                    this.cates[i].childCate[j].isActive = false
                }
            }
        },
        allTask: function () {
            this.toggleInit()
            this.isAllTaskActive = true
            this.createTaskList(this.queryAlltasks())
            this.currentCateTable = "AllCate"
            this.currentCate = ""
            this.cleanAllActiveButton()
            document.getElementById('all-tasks').className = 'active'
        },
        cateClick: function (cate) {
            this.toggleInit()
            cate.isActive = true
            this.createTaskList(this.queryTasksByCate(cate))
            this.currentCateTable = "cate"
            this.currentCate = cate
            this.cleanAllActiveButton()
            document.getElementById('all-tasks').className = 'active'
        },
        childClick: function (child) {
            this.toggleInit()
            child.isActive = true
            this.createTaskList(this.queryTasksByChildCate(child))
            this.currentCateTable = "childCate"
            this.currentCate = child
            this.cleanAllActiveButton()
            document.getElementById('all-tasks').className = 'active'
        },
        clickAddCate: function () {
            this.isCover = true
        },
        cancel: function () {
            this.isCover = false
        },
        ok: function () {
            var oSelect = document.getElementById('modal-select')
            var index = oSelect.selectedIndex;
            if (index === 0) {
                this.cates.push({
                        name: this.message,
                        isDefault: false,
                        isActive: false,
                        childCate: []
                    })
            } else {
                this.cates[index - 1].childCate.push({
                    name: this.message,
                    isActive: false,
                    tasks: []})
            }
            this.isCover = false
        },
        queryAlltasks: function () {
            var resultArr = []
            for (var i = 0; i < this.cates.length; i++) {
                for (var j = 0; j < this.cates[i].childCate.length; j++) {
                    for(var k = 0; k < this.cates[i].childCate[j].tasks.length; k++) {
                        resultArr.push(this.cates[i].childCate[j].tasks[k])
                    }
                }
            }
            return resultArr
        },
        queryTasksByCate: function (cate) {
            var resultArr = []
            for (var i = 0; i < cate.childCate.length; i++) {
                for (var j = 0; j < cate.childCate[i].tasks.length; j++) {
                    resultArr.push(cate.childCate[i].tasks[j])
                }
            }
            return resultArr
        },
        queryTasksByChildCate: function (childCate) {
            var resultArr = []
            for (var i = 0; i < childCate.tasks.length; i++) {
                resultArr.push(childCate.tasks[i])
            } 
            return resultArr
        },
        createTaskList: function (taskArr) {
            this.taskList = []
            for (var i = 0; i < taskArr.length; i++) {
                if (this.taskList.indexOf(taskArr[i].date) == -1) {
                    this.taskList.push({
                                    date: taskArr[i].date,
                                    tasks: []
                                })
                }

            }
            // 对日期排序
            this.taskList = this.taskList.sort(function (a,b) {
                return new Date(a.date) - new Date(b.date)
            })
            
            for (var j = 0; j < this.taskList.length; j++) {
                var tempTasks = []
                for (var k = 0; k < taskArr.length; k++) {
                    if (taskArr[k].date == this.taskList[j].date) {
                        tempTasks.push(taskArr[k]);
                    }
                }
                this.taskList[j].tasks = tempTasks
                console.log(this.taskList[j].tasks.length)
            }

        },
        cleanAllActiveButton: function () {
            document.getElementById('all-tasks').className = ''
            document.getElementById('unfinish-tasks').className = ''
            document.getElementById('finished-tasks').className = ''
        },
        allTasksClick: function () {
            this.cleanAllActiveButton()
            document.getElementById('all-tasks').className = 'active'
            this.taskListUpdate()
        },
        unfinishTaksClick: function () {
            this.cleanAllActiveButton()
            document.getElementById('unfinish-tasks').className = 'active'
            this.taskListUpdate()
            for (var i = 0; i < this.taskList.length; i++) {
                this.taskList[i].tasks = this.taskList[i].tasks.filter(function (item, index, array) {
                    return !item.isFinished
                })
            }
            this.taskList = this.taskList.filter(function (item, index, array) {
                return (item.tasks.length == 0 ? false : true)
            })
        },
        finishedTasksClick: function () {
            this.cleanAllActiveButton()
            document.getElementById('finished-tasks').className = 'active'
            this.taskListUpdate()
            for (var i = 0; i < this.taskList.length; i++) {
                this.taskList[i].tasks = this.taskList[i].tasks.filter(function (item, index, array) {
                    return item.isFinished
                })
            }
            this.taskList = this.taskList.filter(function (item, index, array) {
                return (item.tasks.length == 0 ? false : true)
            })
        },
        taskListUpdate: function () {
            if (this.currentCateTable == "AllCate") {
                this.createTaskList(this.queryAlltasks())
            } else if (this.currentCateTable == "cate") {
                this.createTaskList(this.queryTasksByCate(this.currentCate))
            } else if (this.currentCateTable == "childCate") {
                this.createTaskList(this.queryTasksByChildCate(this.currentCate))
            }
        },
        taskClick: function (task) {
            this.currentTask = task
            this.taskActiveInit()
            task.isActive = true
        },
        taskActiveInit: function () {
            for (var i = 0; i < this.cates.length; i++) {
                for (var j = 0; j < this.cates[i].childCate.length; j++) {
                    for(var k = 0; k < this.cates[i].childCate[j].tasks.length; k++) {
                        this.cates[i].childCate[j].tasks[k].isActive = false
                    }
                }
            }
        },
        pencilClick: function () {
            this.editing = true
        },
        saveClick: function () {
            this.editing = false
            Store.save(this.cates)
            this.taskListUpdate()
        },
        checkClick: function () {
            var r = confirm("是否将任务标记为已完成？")
            if (r) {
                this.currentTask.isFinished = true
                Store.save(this.cates)
            }
        },
        addTask: function () {
            this.currentTask = {
                name: "",
                isActive: false,
                date: "",
                content: "",
                isFinished: false
            }
            this.editing = true
            if (this.currentCateTable == "AllCate") {
                this.cates[0].childCate[0].tasks.push(this.currentTask)
            }
        }
    },
    ready: function () {
        this.currentTask = this.cates[0].childCate[0].tasks[0]
        this.currentCateTable = "AllCate"
        this.currentCate = this.cates[0].childCate[0]
        this.allTask()
        console.log(this.currentTask)
    }
}
</script>