App = {
	loading: false,
	contracts: {},
	button: 'add',
	load: async () => {
		await App.loadWeb3();
		await App.loadAccount();
		await App.loadContract();
		await App.render();
	},

	// https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
	loadWeb3: async () => {
		if (typeof web3 !== 'undefined') {
			App.web3Provider = web3.currentProvider;
			web3 = new Web3(web3.currentProvider);
		} else {
			window.alert('Please connect to Metamask.');
			window.web3 = new Web3(
				new Web3.providers.HttpProvider('http://127.0.0.1:9545')
			);
		}
		// Modern dapp browsers...
		if (window.ethereum) {
			window.web3 = new Web3(ethereum);
			try {
				// Request account access if needed
				await ethereum.enable();
				// Acccounts now exposed
				web3.eth.sendTransaction({
					/* ... */
				});
			} catch (error) {
				// User denied account access...
			}
		}
		// Legacy dapp browsers...
		else if (window.web3) {
			App.web3Provider = web3.currentProvider;
			window.web3 = new Web3(web3.currentProvider);
			// Acccounts always exposed
			web3.eth.sendTransaction({
				/* ... */
			});
		}
		// Non-dapp browsers...
		else {
			console.log(
				'Non-Ethereum browser detected. You should consider trying MetaMask!'
			);
		}
	},

	loadAccount: async () => {
		web3.eth.defaultAccount = web3.eth.accounts[0];
		// Set the current blockchain account
		App.account = web3.eth.accounts[0];
	},

	loadContract: async () => {
		// Create a JavaScript version of the smart contract
		const LostMobileList = await $.getJSON('LostMobileList.json');
		App.contracts.LostMobileList = TruffleContract(LostMobileList);
		App.contracts.LostMobileList.setProvider(App.web3Provider);

		// Hydrate the smart contract with values from the blockchain
		App.LostMobileList = await App.contracts.LostMobileList.deployed();
		console.log(App.LostMobileList);
	},

	render: async () => {
		// Prevent double render
		if (App.loading) {
			return;
		}

		// Update app loading state
		App.setLoading(true);
		const gsm = await App.LostMobileList.gsm();
		
			// Fetch the task data from the blockchain
			
			const operator = await App.LostMobileList.users(App.account);
		// Render Account
		$('#accountAddress').html(App.account);
		$('#ME').html(operator[0]);
		
		if (gsm === App.account) {
			$('#operator-container').show();
			$('#ME').html("GSM ");
		} else {
			$('#operator-container').hide();
		}
		// Render Tasks
		// await App.renderTasks()

		// Update loading state
		App.setLoading(false);
	},

	// renderTasks: async () => {
	//   // Load the total task count from the blockchain
	//   const taskCount = await App.todoList.taskCount()
	//   const $taskTemplate = $('.taskTemplate')

	//   // Render out each task with a new task template
	//   for (var i = 1; i <= taskCount; i++) {
	//     // Fetch the task data from the blockchain
	//     const task = await App.todoList.tasks(i)
	//     const taskId = task[0].toNumber()
	//     const taskContent = task[1]
	//     const taskCompleted = task[2]

	//     // Create the html for the task
	//     const $newTaskTemplate = $taskTemplate.clone()
	//     $newTaskTemplate.find('.content').html(taskContent)
	//     $newTaskTemplate.find('input')
	//                     .prop('name', taskId)
	//                     .prop('checked', taskCompleted)
	//                     .on('click', App.toggleCompleted)

	//     // Put the task in the correct list
	//     if (taskCompleted) {
	//       $('#completedTaskList').append($newTaskTemplate)
	//     } else {
	//       $('#taskList').append($newTaskTemplate)
	//     }

	//     // Show the task
	//     $newTaskTemplate.show()
	//   }
	// },

	opAdd: async () => {
		const opName = $('#opName').val();
		const opAdd = $('#opAdd').val();
		await App.LostMobileList.addOperator(opAdd, opName);
		window.location.reload();
	},
	opDelete: async () => {
		// const opName = $('#opName').val()
		const opAdd = $('#opAdd').val();
		await App.LostMobileList.removeOperator(opAdd);
		window.location.reload();
	},
	addLostMobile: async () => {
		App.button = 'add';
		$('#mobileNumber').prop('disabled', false);
		$('#location').prop('disabled', false);
	},
	editLostMobile: async () => {
		App.button = 'edit';
		$('#mobileNumber').prop('disabled', false);
		$('#location').prop('disabled', false);
	},
	deleteLostMobile: async () => {
		App.button = 'delete';
		$('#mobileNumber').prop('disabled', true);
		$('#location').prop('disabled', true);
	},
	searchLostMobile: async () => {
		App.button = 'search';
		$('#mobileNumber').prop('disabled', true);
		$('#location').prop('disabled', true);
	},
	submitClicked: async () => {
		console.log(App.button);
		if (App.button == 'add') {
			const IMEI = $('#IMEI').val();
			const mobileNumber = $('#mobileNumber').val();
			const location = $('#location').val();
			console.log(IMEI, mobileNumber, location);
			await App.LostMobileList.addLostMobile(IMEI, mobileNumber, location);
			$('#status-id').prop('value', 'Accepted');
			window.location.reload();
		} else if (App.button == 'edit') {
			const IMEI = $('#IMEI').val();
			const mobileNumber = $('#mobileNumber').val();
			const location = $('#location').val();
			await App.LostMobileList.editLostMobile(IMEI, mobileNumber, location);
			$('#status-id').prop('value', 'Accepted');
			window.location.reload();
		} else if (App.button == 'delete') {
			const IMEI = $('#IMEI').val();
			await App.LostMobileList.removeLostMobile(IMEI);
			window.location.reload();
		} else if (App.button == 'search') {
			const IMEI = $('#IMEI').val();

			const lostMobileCount = await App.LostMobileList.lostMobileCount();
			for (var i = 1; i <= lostMobileCount; i++) {
				// Fetch the task data from the blockchain
				const lostMobile = await App.LostMobileList.LostMobiles(i);
				const lostMobileId = lostMobile[0].toNumber();
				const _IMEI = lostMobile[1];
				const mobileNumber = lostMobile[2];
				const location = lostMobile[3];
				console.log(_IMEI, IMEI);
				if (_IMEI === IMEI) {
					$('#SearchResult-id').html('Lost Mobile ID : ' + lostMobileId);
					$('#SearchResult-IMEI').html('IMEI Number' + _IMEI);
					$('#SearchResult-mob').html('Mobile Number' + mobileNumber);
					$('#SearchResult-loc').html('Location' + location);
				}
				// console.log(lostMobileId, _IMEI, mobileNumber, location);
			}
		}
	},

	setLoading: (boolean) => {
		App.loading = boolean;
		const loader = $('#loader');
		const content = $('#content');
		if (boolean) {
			loader.show();
			content.hide();
		} else {
			loader.hide();
			content.show();
		}
	},
};

$(() => {
	$(window).load(() => {
		App.load();
	});
});
