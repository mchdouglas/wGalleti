(function () {
	'use strict'

	angular
		.module('webProfile')
		.factory('ProfileService', ProfileService)

	function ProfileService() {
		var self = {
			username : 'William Galleti',
			picture : 'https://avatars0.githubusercontent.com/u/2036130?v=3&s=460',
			email : 'william.galleti@gmail.com',
			age : 28,
			contact : '+55 65 999448004',
			telegram : 'telegram.me/wGalleti',
			github : 'github.com/wGalleti',
			about : 'Apaixonado por tecnologia gosto de ver dados transformados em informações. </br> Autodidático e flexivél, estou sempre procurando aprender novas tecnologias e sinto satisfação ao ver um produto sendo utilizado!',
			education : {
				course : 'Administração de Empresas',
				institution : 'Unic - Universidade de Cuiaba',
				conclusion : 2010
			},
			skills : [{
				name : 'Web',
				info : [
					{name : 'PHP', rating : 3},
					{name : 'C#', rating : 2},
					{name : 'JavaScript', rating : 4},
				]
			},{
				name : 'Desktop',
				info : [
					{name : 'Delphi', rating : 4},					
					{name : 'C#', rating : 2},					
				]
			},{
				name : 'DB',
				info : [
					{name : 'Oracle', rating : 4},					
					{name : 'MySql', rating : 4},
					{name : 'SQLServer', rating : 3},
					{name : 'SQLite', rating : 3},
				]
			},{
				name : 'Frameworks',
				info : [
					{name : 'AngularJS', rating : 4},
					{name : 'CodeIgniter', rating : 4},
					{name : 'Laravel', rating : 2},
					{name : 'Asp.Net MVC', rating : 2},
					{name : 'Bootstrap', rating : 4},
					{name : 'MaterializeCSS', rating : 4},
				]
			},{
				name : 'Legados',
				info : [
					{name : 'ERP Sapiens', owner : 'Sênior Sistemas', rating : 3, tags : ['Suprimentos', 'Financeiro', 'Fiscal', 'Contábil']},
					{name : 'Mosayco', owner : 'Unisystem', rating : 4, tags : ['Suprimentos', 'Financeiro', 'Fiscal', 'Contábil', 'Algodão', 'Grãos']},
					{name : 'Gatec', owner : 'Gatec', rating : 3, tags : ['Mecanização', 'Beneficiamento', 'Safras', 'Comercial', 'Integração']},
				]
			},{
				name : 'Outros',
				info : [
					{name : 'WindowsPhone8 C#', rating : 2},
					{name : 'SêniorLSP', rating : 3},
					{name : 'QlikView', rating : 2},
					{name : 'SQL', rating : 4},
					{name : 'FastReport', rating : 3},
					{name : 'Office', rating : 4},
				]
			}, {
				name : 'Compentêcias',
				info : [
					{name : 'Flexibilidade', rating : 3},
					{name : 'Comunicação', rating : 2},
					{name : 'Liderança', rating : 2},
					{name : 'Visão Sistêmica', rating : 4}
				]
			}],
			projects : [{
				name : 'webPluma', 
				description : 'Painel de informações para gestão de Algodão integrados ao sistema Gatec', 
				tags : [
					'Oracle',
					'PHP',
					'CodeIgniter',
					'AngularJS',
					'Bootstrap'
				]
			},{
				name : 'GSCotton',
				description : 'Processo de coleta de dados de algodão da etapa de plantio até beneficiamento',
				tags : [
					'Oracle',
					'Asp.Net MVC',
					'WindowsPhone8'
				]
			}, {
				name : 'GSEmblocamento',
				description : 'Processo de Emblocamento de pluma integrado ao sistema Gatec com foco em facilidades para os operadores',
				tags : [
					'Oracle',
					'Delphi',
					'DevExpress'
				]
			}, {
				name : 'GSClassificação',
				description : 'Processo de classificação de pluma integrado ao sistema Gatec com foco em facilidades para os operadores e integrado com RFID',
				tags : [
					'Oracle',
					'Delphi',
					'DevExpress'
				]
			}],
			jobs : [{
				company : 'Grupo Scheffer',
				begin : '2006-06-01',
				end : '2010-01-19',
				img : 'https://gruposcheffer.s3.amazonaws.com/images/logo-full.png',
				role : 'Analista de Sistemas (Junior, Master, Sênior)',
				description : 'Suporte Infra-Estrutura, Suporte-Sistema, Desenvolvimento de ferramentas complementares ao sistema, Auxiliar de Desenvolvimento de Processos, etc.;',
				site : 'http://www.gruposcheffer.com.br'
			},{
				company : 'Unisystem Sistemas Agricola',
				begin : '2010-07-06',
				end : '2011-10-31',
				img : 'http://crm.unisystem.agr.br/CRMUnisystem/resources/LogoNew.jpg',
				role : 'Analista Externo',
				description : 'Atendimento ao cliente, análise e definição de solução para problemas, documentação de solicitações e encaminhamento para desenvolvimento, comercial;',
				site : 'http://www.unisystem.agr.br'
			},{
				company : 'Grupo Scheffer',
				begin : '2011-11-01',
				end : '',
				img : 'https://gruposcheffer.s3.amazonaws.com/images/logo-full.png',
				role : 'Analista de Desenvolvimento',
				description : 'Desenvolvimento de Aplicações internas para suporte ao ERP e Legados, Administração de Banco de dados, Administração de Servidores WEB, Desenvolvimento de Integrações entre ERP e sistemas Legados, Desenvolvimento de Indicadores para BI, etc.',
				site : 'http://www.gruposcheffer.com.br'
			}]
		}


		return self
	}
})(); 