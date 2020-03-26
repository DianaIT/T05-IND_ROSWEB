window.onload = function() {
let vueApp = new Vue({
    el: "#vueApp",
    data: {
        // ros connection
        ros: null,
        rosbridge_address: 'ws://127.0.0.1:9090/',
        connected: false,
        menu_title: 'State Machine',
        main_title: 'ROSWeb & State Machines',
        // page content
        loading: false,
        service_busy: false,
        param_val: 0,
        param_read_val: 0,
        service_response: ''

    },

   methods: {
        connect: function() {
            // define ROSBridge connection object
            this.ros = new ROSLIB.Ros({
                url: this.rosbridge_address
            })

            // define callbacks
            this.ros.on('connection', () => {
                this.connected = true
                this.loading = false
                console.log('Connection to ROSBridge established!')
             })
            this.ros.on('error', (error) => {
                console.log('Something went wrong when trying to connect')
                console.log(error)
            })
            this.ros.on('close', () => {
                this.connected = false
                this.loading = false
                console.log('Connection to ROSBridge was closed!')
            })
        },
        disconnect: function() {
            this.ros.close()
        },

        set_param: function(){
            console.log('set_param called...')
             // set service busy
             service_busy = true

             let web_param = new ROSLIB.Param({
                ros: this.ros,
                name: 'web_param'
             })

             web_param.set(this.param_val)
             service_busy = false
             console.log('Reading param')
         },

        read_param: function(){
              // set service busy
             service_busy = true

             let web_param = new ROSLIB.Param({
                ros: this.ros,
                name: 'web_param'
             })

             web_param.get((value) => {
                service_busy = false
                this.param_read_val = value
             }), (err) =>{
                service_busy = false
             }
        },
        callMoveSquare: function(){
            console.log('callMoveSquare called...')
            this.service_busy = true
            this.service_response = ''
            // define the Service to call
            let service = new ROSLIB.Service({
                ros: this.ros,
                name: '/move_square',
                serviceType: 'my_custom_service_msg/MyCustomServiceMessage'
             })
            // define the request
            let request = new ROSLIB.ServiceRequest({
                duration: this.param_val,
            })
            // define a callback
            service.callService(request, (result) => {
                this.service_busy = false
                this.service_response = JSON.stringify(result)
            }, (error) => {
                this.service_busy = false
                console.error(error)
            })

        },

    },

    mounted() {
        // page is ready
        console.log('page is ready!')
    },
});
}