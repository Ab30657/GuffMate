import {
	trigger,
	transition,
	style,
	query,
	animateChild,
	group,
	animate,
} from '@angular/animations';
export const routeTransitionAnimations = trigger('triggerName', [
	transition('one => two', [
		query(
			':enter, :leave',
			style({ position: 'fixed', 'z-index': '100' }),
			{
				optional: true,
			}
		),
		group([
			query(
				':enter',
				[
					style({ transform: 'translateX(100%)', opacity: 0 }),
					animate(
						'.5s ease-in-out',
						style({ transform: 'translateX(0%)', opacity: 1 })
					),
				],
				{ optional: true }
			),
			query(
				':leave',
				[
					style({ transform: 'translateX(0%)' }),
					animate(
						'.5s ease-in-out',
						style({ transform: 'translateX(-100%)', opacity: 0 })
					),
				],
				{ optional: true }
			),
		]),
	]),
	transition('two => one', [
		query(
			':enter, :leave',
			style({ position: 'fixed', 'z-index': '100' }),
			{
				optional: true,
			}
		),
		group([
			query(
				':enter',
				[
					style({ transform: 'translateX(-100%)', opacity: 0 }),
					animate(
						'.5s ease-in-out',
						style({ transform: 'translateX(0%)', opacity: 1 })
					),
				],
				{ optional: true }
			),
			query(
				':leave',
				[
					style({ transform: 'translateX(0%)', opacity: 1 }),
					animate(
						'.5s ease-in-out',
						style({ transform: 'translateX(100%)', opacity: 0 })
					),
				],
				{ optional: true }
			),
		]),
	]),
]);
