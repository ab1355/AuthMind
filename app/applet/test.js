console.log(Object.keys(process.env).filter(k => k.toLowerCase().includes('token') || k.toLowerCase().includes('api')));
