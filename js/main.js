Vue.component('task-form', {
    props: [],
    template: `
    <div class="content_form">
        <form @submit.prevent="addTask">
            <label for="task-name">Создайте новую задачу:</label>
            <input class="input" id="task-name" type="text" v-model="taskName"><br><br>
            <label for="task-desc">Описание задачи:</label>
            <textarea id="task-desc" v-model="description"></textarea><br><br>
            <label for="deadline">Срок сдачи:</label>
            <input type="date" id="deadline" v-model="deadline" name="deadline-task" min="2024-01-01" max="2025-12-31" required />
            <button type="submit">Создать</button>
        </form>
    </div>
    `,
    data() {
        return {
            taskName: '',
            description: '',
            deadline: ''
        };
    },
    methods: {
        addTask() {
            if (this.taskName !== '') {
                const newTask = {
                    title: this.taskName,
                    description: this.description,
                    deadline: this.deadline,
                    reason: ''
                };
                newTask.createdDate = new Date().toLocaleDateString();
                this.$emit('add', newTask);
                this.taskName = '';
                this.description = '';
                this.deadline = '';
            } else {
                alert("Введите название задачи");
            }
        }
    }
})
Vue.component('task-column', {
    props: ['title', 'tasks', 'type'],
    template: `
    <div class="column">
        <h2 class="title_column">{{ title }}</h2>
        <task v-for="task in tasks" :key="task.id" :task="task" :type="type" @delete="handleDeleteTask" @move="moveTask" @move-to-next="moveToNext" @return="returnTask" @complete="completeTask"></task>
    </div>
    `,
    methods: {
        handleDeleteTask(task) {
            this.$emit('delete-task', task);
        },
        moveTask(task) {
            this.$emit('move-task', task);
        },
        moveToNext(task) {
            const indexTesting = this.tasks.indexOf(task);
            if (this.type === 'work' && indexTesting !== -1 && task.reason) {
                task.reason = '';
            }
            this.$emit('move-to-next', task);
        },
        returnTask(task) {
            this.$emit('return-task', task);
        },
        completeTask(task) {
            this.$emit('complete-task', task);
        }
    }
});
Vue.component('app', {
    template: `
    <div id="app">
        <task-form @add="addTask"></task-form>
        <div class="board">
            <task-column title="Запланированные задачи" :tasks="planTask" type="plan" @delete-task="deleteTask" @move-task="moveTask" @move-to-next="moveToNext" @return-task="returnTask" @complete-task="completeTask"></task-column>
            <task-column title="В работе" :tasks="workTask" type="work" @delete-task="deleteTask" @move-task="moveTask" @move-to-next="moveToNext" @return-task="returnTask" @complete-task="completeTask"></task-column>
            <task-column title="Тестирование" :tasks="testingTask" type="testing" @delete-task="deleteTask" @move-task="moveTask" @move-to-next="moveToNext" @return-task="returnTask" @complete-task="completeTask"></task-column>
            <task-column title="Выполненные задачи" :tasks="completedTask" type="completed"></task-column>
        </div>
    </div>
    `,
    data() {
        return {
            planTask: [],
            workTask: [],
            testingTask: [],
            completedTask: []
        };
    }
});
new Vue({
    el: '#app'
});
