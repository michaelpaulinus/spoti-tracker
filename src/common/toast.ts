import { useToast } from "vue-toastification";

const toastInterface = useToast();

const toast = {
	error: (message: string) => {
		return toastInterface.error(message);
	},

	success: (message: string) => {
		return toastInterface.success(message);
	},

	warning: (message: string) => {
		return toastInterface.warning(message);
	},
};

export default toast;
