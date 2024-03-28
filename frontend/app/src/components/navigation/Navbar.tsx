import React from 'react';
import './page-navigation.css';
import { Link } from 'react-router-dom';

export const Navbar = ({
	onChangePage,
}: {
	onChangePage: (pageName: string) => void;
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
					<ul className="nav_list">
						<li
							className="nav_link"
							onClick={() => onChangePage('page1')}
						>
							<Link to={'page1'}>
								<i className="fas fa-object-group"></i>
								<span className="nav_name">page1</span>
							</Link>
						</li>
						<li
							className="nav_link"
							onClick={() => onChangePage('page2')}
						>
							<Link to={'page2'}>
								<i className="fas fa-object-group"></i>
								<span className="nav_name">page1</span>
							</Link>
						</li>
						<li
							className="nav_link"
							onClick={() => onChangePage('page3')}
						>
							<Link to={'page3'}>
								<i className="fas fa-object-group"></i>
								<span className="nav_name">page1</span>
							</Link>
						</li>
					</ul>
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
