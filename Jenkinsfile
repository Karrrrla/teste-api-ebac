pipeline {
    agent any

    stages {
        stage('Clonar o repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/Karrrrla/teste-api-ebac'
            }
        }
        stage('Instalar Dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Executar Testes'){
            steps {
                sh 'set NO_COLOR=1 npm run cy:run'
            }
        }
    }
}