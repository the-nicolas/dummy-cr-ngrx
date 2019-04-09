class AuthMixin {
    
    execute:any;

    getEndpointPrefix() {

        return ['api', 'v1']

    }

    getEndpoint() {

        return []

    }

    login(credentials) {
        
        // {deviceUid: ""}
        
        let options = {
            channelConfig: ['rest'],
            useAuth: false
        };
        return this.execute("auth", "device", null, credentials, options);
    }

}

export {AuthMixin}
