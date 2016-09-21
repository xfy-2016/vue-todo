<template>
  	<div class="left">
     	<div class="list-title all-tasks active">
          所有任务 ({{num}})
      	</div>
      	<div class="list-title">分类列表</div>
      	<div id="listcontent" class="list">
			<ul>
				<li v-for="cate in cates">
					<h2><i class="fa fa-folder-open"></i><span>{{cate.name}}</span> ({{cate.childCate.length}})</h2>
				    <ul>
				        <li v-for="child in cate">
				            <h3><i class="fa fa-file-o"></i><span>{{child.name}}</span> ({{child.tasks.length}})</h3>
				        </li>
				    </ul>
				</li>
			</ul>
		</div>

      	<button class="add" onclick="clickAddCate()"><i class="fa fa-plus"></i>新增分类</button>
  	</div>
</template>

<script>
export default {
  data: function () {
    return {
      cates: [
      	{
      		name: "默认分类",
      		isDefault: true,
      		childCate: [{
      			name: "默认子分类",
      			tasks: [{
      				name: "使用说明",
      				date: "2016-09-13",
      				content: "我是使用说明",
      				isFinished: true
      			}]
      		}]
      	},
      	{
      		name: "工作",
      		isDefault: false,
      		childCate: {
      			name: "前端",
      			child: {
      				name: "task1",
      				date: "2016-09-14",
      				content: "百度前端任务",
      				isFinished: true
      			}
      		}
      	}
      ]
    }
  },
  watch: {
  	cate: {
  		handler: function (cates) {
  			Store.save()
  		},
  		deep: true
  	}
  }
}
</script>