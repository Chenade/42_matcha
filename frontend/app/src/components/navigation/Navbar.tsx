import React from 'react';
import './page-navigation.css';
import { Link } from 'react-router-dom';

export type PageTitle = 'page1 Title' | 'page2 Title' | 'About Me';

export const Navbar = ({
	setPageTitle,
}: {
	setPageTitle: (pageTitle: PageTitle) => void;
}) => {
	const logout = () => {
		localStorage.removeItem('Token');
		localStorage.removeItem('path');
		localStorage.removeItem('forceLogout');
		window.location.href = '/';
	};

	return (
		<div className="l-navbar" id="nav-bar">
			<nav className="nav">
				<div>
					<a href="/" className="nav_logo">
						<i className="bx bx-layer nav_logo-icon"></i>
						<span className="nav_logo-name">Matcha</span>
					</a>

					<NavbarMenuItem
						onClickMenuItem={() => setPageTitle('page1 Title')}
						menuItemLabel="Explorer"
						pagePath="explorer"
					/>
					<NavbarMenuItem
						onClickMenuItem={() => setPageTitle('page2 Title')}
						menuItemLabel="Connection"
						pagePath="connection"
					/>
					<NavbarMenuItem
						onClickMenuItem={() => setPageTitle('About Me')}
						menuItemLabel="About Me"
						pagePath="me"
					/>
				</div>
				<a
					className="nav_link"
					href="javascript:void(0)"
					onClick={logout}
				>
					<i className="fas fa-sign-out-alt"></i>
					<span className="nav_name">SignOut</span>
				</a>
			</nav>
		</div>
	);
};

const NavbarMenuItem = ({
	menuItemLabel,
	pagePath,
	onClickMenuItem,
}: {
	menuItemLabel: string;
	pagePath: string;
	onClickMenuItem: () => void;
}) => {
	return (
		<Link to={pagePath} className="nav_link" onClick={onClickMenuItem}>
			{menuItemLabel}
		</Link>
	);
};
